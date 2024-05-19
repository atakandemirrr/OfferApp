using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OfferApp.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate222 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Product",
                table: "Offers");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Products",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerCode",
                table: "Offers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "ProductCode",
                table: "Offers",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Customers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Products_Code",
                table: "Products",
                column: "Code");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Customers_Code",
                table: "Customers",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_CustomerCode",
                table: "Offers",
                column: "CustomerCode");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_ProductCode",
                table: "Offers",
                column: "ProductCode");

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Customers_CustomerCode",
                table: "Offers",
                column: "CustomerCode",
                principalTable: "Customers",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Products_ProductCode",
                table: "Offers",
                column: "ProductCode",
                principalTable: "Products",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Customers_CustomerCode",
                table: "Offers");

            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Products_ProductCode",
                table: "Offers");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Products_Code",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Offers_CustomerCode",
                table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Offers_ProductCode",
                table: "Offers");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Customers_Code",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "ProductCode",
                table: "Offers");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerCode",
                table: "Offers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "Product",
                table: "Offers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Customers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
